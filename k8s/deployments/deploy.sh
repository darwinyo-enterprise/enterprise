echo "#################### Cleaning up old deployment ####################"
kubectl delete namespace enterprise
kubectl delete deployments --all
kubectl delete services --all
# # kubectl delete configmap config-files || true
# kubectl delete configmap urls || true
# kubectl delete configmap externalcfg || true
# kubectl delete configmap internalurls || true

echo "#################### Wait 5 second to stable ####################"
sleep 5;

echo "#################### Deploying namespace ####################"
kubectl create -f enterprise-namespace.yaml

echo "#################### Wait 5 second to stable ####################"
sleep 5;

echo "#################### Deploying infrastructure components ####################"
# kubectl create configmap config-files --from-file=nginx-conf=nginx.conf
# kubectl label configmap config-files app=enterprise
kubectl create -f sql-data.yaml -f basket-data.yaml -f keystore-data.yaml -f rabbitmq.yaml -f nosql-data.yaml

echo "#################### Creating application service definitions ####################"
kubectl create -f services.yaml

echo "#################### Creating application configuration ####################"

# urls configmap
kubectl create -f urls.yaml
kubectl create -f conf-local.yaml
kubectl create -f internalurls.yaml

# Create application pod deployments
kubectl create -f deployments.yaml

echo "#################### Deploying application pods ####################"

# update deployments with the correct image (with tag and/or registry)
kubectl set image deployments/basket "basket=darwinyo/basket.api:latest" --namespace=enterprise
kubectl set image deployments/catalog "catalog=darwinyo/catalog.api:latest" --namespace=enterprise
kubectl set image deployments/identity "identity=darwinyo/identity.api:latest" --namespace=enterprise
kubectl set image deployments/order "order=darwinyo/order.api:latest" --namespace=enterprise
kubectl set image deployments/payment "payment=darwinyo/payment.api:latest" --namespace=enterprise
kubectl set image deployments/order-backgroundtasks "order-backgroundtasks=darwinyo/order.backgroundtasks:latest" --namespace=enterprise
kubectl set image deployments/order-signalrhub "order-signalrhub=darwinyo/order.signalrhub:latest" --namespace=enterprise
kubectl set image deployments/commerce-admin "commerce-admin=darwinyo/commerce.admin:latest" --namespace=enterprise
kubectl set image deployments/commerce-client "commerce-client=darwinyo/commerce.client:latest" --namespace=enterprise
kubectl set image deployments/webstatus "webstatus=darwinyo/webstatus:latest" --namespace=enterprise

kubectl rollout resume deployments/basket --namespace=enterprise
kubectl rollout resume deployments/catalog --namespace=enterprise
kubectl rollout resume deployments/identity --namespace=enterprise
kubectl rollout resume deployments/order --namespace=enterprise
kubectl rollout resume deployments/payment --namespace=enterprise
kubectl rollout resume deployments/order-backgroundtasks --namespace=enterprise
kubectl rollout resume deployments/order-signalrhub --namespace=enterprise
kubectl rollout resume deployments/commerce-admin --namespace=enterprise
kubectl rollout resume deployments/commerce-client --namespace=enterprise
kubectl rollout resume deployments/webstatus --namespace=enterprise

echo "WebSPA is exposed at http://$externalDns, WebMVC at http://$externalDns/webmvc, WebStatus at http://$externalDns/webstatus"
echo "Enterprise System deployment is DONE"
