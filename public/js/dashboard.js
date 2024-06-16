/* document.addEventListener('DOMContentLoaded', function() {
    const user = JSON.parse(sessionStorage.getItem('user'));

    if (user) {
        document.getElementById('user-name').textContent = user.name;

        fetch(`/api/orders?userId=${user.id}`)
            .then(response => response.json())
            .then(orders => {
                if (orders.length > 0) {
                    const lastOrder = orders[orders.length - 1];
                    document.getElementById('order-id').textContent = lastOrder.formattedOrderId;
                    document.getElementById('order-total').textContent = `R$${lastOrder.total_price.toFixed(2)}`;
                    document.getElementById('order-status').textContent = lastOrder.status;
                } else {
                    document.getElementById('order-details').innerHTML = '<p>Você ainda não tem pedidos.</p>';
                }
            })
            .catch(error => {
                document.getElementById('order-details').innerHTML = `<p>Erro ao carregar o pedido: ${error.message}</p>`;
            });
    } else {
        document.getElementById('order-details').innerHTML = '<p>Usuário não autenticado.</p>';
    }
});
 */

document.addEventListener('DOMContentLoaded', function () {
    const user = JSON.parse(sessionStorage.getItem('user'));
    const welcomeMessage = document.getElementById('welcome-message');
    const orderDetails = document.getElementById('order-details');
    const orderContainer = document.getElementById('order-container');

    if (user) {
        welcomeMessage.textContent = `Olá, ${user.name}`;

        fetch(`/api/orders?userId=${user.id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao buscar pedido');
                }
                return response.json();
            })
            .then(order => {
                if (!order.id) {
                    orderContainer.innerHTML = `<p>Você ainda não tem pedidos.</p>`;
                } else {
                    orderContainer.innerHTML = `
                        <p>ID do Pedido: ${order.formattedOrderId}</p>
                        <p>Total: R$${order.total_price.toFixed(2)}</p>
                        <p>Status: ${order.status}</p>
                    `;
                }
            })
            .catch(error => {
                orderContainer.innerHTML = `<p class="text-danger">Erro ao buscar pedido.</p>`;
                console.error(error);
            });
    } else {
        window.location.href = '/login.html';
    }
});
