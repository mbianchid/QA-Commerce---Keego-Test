document.addEventListener('DOMContentLoaded', function() {
    const userId = 1; // Supondo um usuário com id 1
    fetch(`/api/carrinho/${userId}`)
        .then(response => response.json())
        .then(cartItems => {
            const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
            document.getElementById('cart-count').textContent = cartCount;
        })
        .catch(error => console.error('Erro ao buscar produtos no carrinho:', error));
});
