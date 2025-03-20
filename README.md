# Bookstore MSA 플랫폼

## 개요
- NestJS 기반의 마이크로서비스 아키텍처 (MSA)
- 서비스 간 gRPC 통신 및 API Gateway를 통한 REST API 제공
- 로컬 Minikube 환경에서 Docker와 Kubernetes로 배포

# Docker & Kubernetes 배포
1. Minikube Docker 환경 활성화:

```bash
brew install minikube # mac os
minikube start
eval $(minikube docker-env)
```

2. Docker 이미지 빌드
```bash
docker build -t {service-name}:latest -f apps/{service-directory}/Dockerfile .
```

3. Kubernetes 리소스 배포:
```bash
kubectl apply -f configmap.yaml #환경 변수
kubectl apply -f apps/postgres/k8s/  #DB
kubectl apply -f apps/{service-directory}/k8s/  #services
```

4. API Gateway 접근
+ 포트포워딩
```bash
kubectl port-forward svc/api-gateway-service 3000:3000
```
## 로컬 배포
- **전체 서비스 실행 (DB는 별도로 연결 필요 .env 파일내에서 endpoint 수정)**  
```bash
npm run start:all
```

+ Swagger UI 확인: http://localhost:3000/api

<img width="1016" alt="image" src="https://github.com/user-attachments/assets/830cf4e7-5e6c-4b92-8cbe-dde0136a56a9" />

