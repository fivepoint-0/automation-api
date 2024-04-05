IMAGE_REPOSITORY_URL=ghcr.io
IMAGE_NAME=automation_api
IMAGE_TAG=1.0.0

build:
	  @echo "Building image..."
	  @docker build . -t $(IMAGE_REPOSITORY_URL)/$(IMAGE_NAME):latest

tag:
	  @echo "Tagging image..."
	  @docker tag $(IMAGE_REPOSITORY_URL)/$(IMAGE_NAME):latest $(IMAGE_REPOSITORY_URL)/$(IMAGE_NAME):$(IMAGE_TAG)

run:
	  @echo "Running image..."
	  @docker run -p 8080:3000 $(IMAGE_REPOSITORY_URL)/$(IMAGE_NAME):latest