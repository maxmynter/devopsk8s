package main

import (
	"context"
	"log"

	appsv1 "k8s.io/api/apps/v1"
	corev1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/apis/meta/v1/unstructured"
	"k8s.io/apimachinery/pkg/runtime/schema"
	"k8s.io/apimachinery/pkg/util/intstr"
	"k8s.io/client-go/dynamic"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/rest"
)

var dummySiteGVR = schema.GroupVersionResource{
	Group:    "myapp.example.com",
	Version:  "v1",
	Resource: "dummysites",
}

func main() {
	config, err := rest.InClusterConfig()
	if err != nil {
		log.Fatalf("Failed to get in-cluster config: %v", err)
	}

	clientset, err := kubernetes.NewForConfig(config)
	if err != nil {
		log.Fatalf("Failed to create Kubernetes client: %v", err)
	}

	dynamicClient, err := dynamic.NewForConfig(config)
	if err != nil {
		log.Fatalf("Failed to create dynamic client: %v", err)
	}

	log.Println("Starting DummySite controller")

	watcher, err := dynamicClient.Resource(dummySiteGVR).Watch(context.TODO(), metav1.ListOptions{})
	if err != nil {
		log.Fatalf("Failed to watch DummySites: %v", err)
	}

	for event := range watcher.ResultChan() {
		dummySite, ok := event.Object.(*unstructured.Unstructured)
		if !ok {
			log.Printf("Unexpected object type: %T", event.Object)
			continue
		}
		handleDummySite(clientset, dummySite)
	}
}

func handleDummySite(clientset *kubernetes.Clientset, dummySite *unstructured.Unstructured) {
	name := dummySite.GetName()
	namespace := dummySite.GetNamespace()
	websiteURL, _, _ := unstructured.NestedString(dummySite.Object, "spec", "website_url")

	deployment := &appsv1.Deployment{
		ObjectMeta: metav1.ObjectMeta{
			Name:      name,
			Namespace: namespace,
		},
		Spec: appsv1.DeploymentSpec{
			Replicas: int32Ptr(1),
			Selector: &metav1.LabelSelector{
				MatchLabels: map[string]string{"app": name},
			},
			Template: corev1.PodTemplateSpec{
				ObjectMeta: metav1.ObjectMeta{
					Labels: map[string]string{"app": name},
				},
				Spec: corev1.PodSpec{
					Containers: []corev1.Container{
						{
							Name:  "nginx",
							Image: "nginx:latest",
							Env: []corev1.EnvVar{
								{Name: "WEBSITE_URL", Value: websiteURL},
							},
						},
					},
				},
			},
		},
	}

	_, err := clientset.AppsV1().Deployments(namespace).Create(context.TODO(), deployment, metav1.CreateOptions{})
	if err != nil {
		log.Printf("Failed to create Deployment: %v", err)
	}

	service := &corev1.Service{
		ObjectMeta: metav1.ObjectMeta{
			Name:      name,
			Namespace: namespace,
		},
		Spec: corev1.ServiceSpec{
			Selector: map[string]string{"app": name},
			Ports: []corev1.ServicePort{
				{Port: 80, TargetPort: intstr.FromInt(80)},
			},
		},
	}

	_, err = clientset.CoreV1().Services(namespace).Create(context.TODO(), service, metav1.CreateOptions{})
	if err != nil {
		log.Printf("Failed to create Service: %v", err)
	}

	log.Printf("Created resources for DummySite %s with URL: %s", name, websiteURL)
}

func int32Ptr(i int32) *int32 { return &i }
