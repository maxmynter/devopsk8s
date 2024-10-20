helm install my-nats oci://registry-1.docker.io/bitnamicharts/nats \
  --create-namespace \
  --namespace project \
  --set auth.enabled=false
