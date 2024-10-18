Execute the `setup` shell scripts. 
Do the nats one first as it implicitly creates the project namespace. 
then use k apply -k  to apply the kustomization yaml 
Here you can change the revisions to use 
Update revisions with docker build / docker buildx build commands. 

You don't need the discord-secret.yaml. It is be appended to the secret yaml (& gitignored).
