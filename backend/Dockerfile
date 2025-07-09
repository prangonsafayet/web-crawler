FROM golang:1.22-alpine

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN go mod vendor
ENV GOFLAGS="-mod=vendor"

RUN go build -o main .

EXPOSE 8080
CMD ["./main"]
