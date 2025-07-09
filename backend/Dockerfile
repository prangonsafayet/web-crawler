FROM golang:1.24.4-alpine

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN go mod vendor
ENV GOFLAGS="-mod=vendor"

RUN go build -o main ./cmd

EXPOSE 8080
CMD ["./main"]
