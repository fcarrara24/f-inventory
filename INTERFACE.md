# Inventory API - Documentazione Interfaccia

## 🚀 Avvio Server

```bash
dotnet run
```
Server avviato su: `http://localhost:5256`

## 📚 Documentazione API

### Swagger UI
- **URL**: `https://localhost:5256/swagger`
- Interfaccia interattiva per testare tutti gli endpoint

## 🔐 Autenticazione

### 1. Registrazione Utente
```http
POST /api/users
Content-Type: application/json

{
  "name": "Mario Rossi",
  "email": "mario@example.com",
  "password": "password123"
}
```

### 2. Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "mario@example.com",
  "password": "password123"
}
```

**Risposta**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "name": "Mario Rossi",
    "email": "mario@example.com"
  }
}
```

### 3. Usare il Token
Aggiungi header alle richieste protette:
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 📦 Endpoint Principali

### Utenti (Lavoratori)
- `GET /api/users` - Lista utenti (protetto)
- `GET /api/users/{id}` - Dettaglio utente (protetto)
- `POST /api/users` - Crea utente
- `PUT /api/users/{id}` - Aggiorna utente (protetto)
- `DELETE /api/users/{id}` - Elimina utente (protetto)

### Prodotti (Anagrafica Articoli)
- `GET /api/products` - Lista prodotti
- `GET /api/products/{id}` - Dettaglio prodotto
- `POST /api/products` - Crea prodotto
- `PUT /api/products/{id}` - Aggiorna prodotto
- `DELETE /api/products/{id}` - Elimina prodotto

### Stock (Magazzino)
- `GET /api/stocks` - Lista stock
- `GET /api/stocks/{id}` - Dettaglio stock
- `POST /api/stocks` - Crea stock
- `PUT /api/stocks/{id}` - Aggiorna stock
- `DELETE /api/stocks/{id}` - Elimina stock

### Clienti (Anagrafica Clienti)
- `GET /api/customers` - Lista clienti
- `GET /api/customers/{id}` - Dettaglio cliente
- `POST /api/customers` - Crea cliente
- `PUT /api/customers/{id}` - Aggiorna cliente
- `DELETE /api/customers/{id}` - Elimina cliente

### Ordini (Gestione Ordini)
- `GET /api/orders` - Lista ordini
- `GET /api/orders/{id}` - Dettaglio ordine completo
- `POST /api/orders` - Crea nuovo ordine
- `PUT /api/orders/{id}` - Aggiorna testata ordine
- `PUT /api/orders/{id}/status` - Aggiorna stato ordine
- `PUT /api/orders/{id}/archive` - Archivia/De-archivia ordine
- `DELETE /api/orders/{id}` - Elimina ordine

### Righe Ordine
- `GET /api/orders/{orderId}/items` - Lista righe ordine
- `GET /api/orders/{orderId}/items/{itemId}` - Dettaglio riga
- `POST /api/orders/{orderId}/items` - Aggiungi riga ordine
- `PUT /api/orders/{orderId}/items/{itemId}` - Aggiorna riga
- `PUT /api/orders/{orderId}/items/{itemId}/status` - Aggiorna stato riga
- `DELETE /api/orders/{orderId}/items/{itemId}` - Elimina riga

### Autenticazione
- `POST /api/auth/login` - Login
- `POST /api/auth/change-password` - Cambio password (protetto)
- `GET /api/auth/me` - Info utente corrente (protetto)

## �️ Architettura Sistema

### 📋 Modelli Dati

#### 👤 User (Utenti Lavoratori)
Gestione accessi e autorizzazioni sistema
```json
{
  "id": "guid",
  "name": "Mario Rossi",
  "email": "mario@azienda.it",
  "passwordHash": "hash_sha256"
}
```

#### 📦 Product (Anagrafica Articoli)
Catalogo prodotti aziendali
```json
{
  "id": "guid",
  "code": "ART-001",
  "description": "Laptop Dell XPS 15",
  "unit": 1
}
```

#### 📊 Stock (Magazzino)
Quantità disponibili per prodotto
```json
{
  "id": "guid",
  "productId": "guid",
  "units": 50,
  "lastUpdate": "2024-02-21T10:00:00Z"
}
```

#### 🏢 Customer (Anagrafica Clienti)
Dati anagrafici clienti business
```json
{
  "id": "guid",
  "code": "CLI-001",
  "name": "SRL Italia",
  "email": "info@client.it",
  "phone": "+39 0123456789",
  "address": "Via Roma 1, Milano",
  "vat": "IT12345678901",
  "isActive": true
}
```

#### 📋 Order (Testata Ordini)
Gestione ordini clienti con stati avanzamento
```json
{
  "id": "guid",
  "orderNumber": "ORD-2024-001",
  "customerId": "guid",
  "status": "Confirmed",
  "isArchived": false,
  "totalAmount": 1500.00,
  "vatAmount": 330.00,
  "totalItems": 3,
  "orderDate": "2024-02-21T10:00:00Z",
  "deliveryDate": "2024-02-28T00:00:00Z"
}
```

#### 📝 OrderItem (Righe Ordine)
Dettaglio prodotti per ogni ordine
```json
{
  "id": "guid",
  "orderId": "guid",
  "productId": "guid",
  "description": "Laptop Dell XPS 15",
  "quantity": 2,
  "unitPrice": 750.00,
  "totalPrice": 1500.00,
  "vatRate": 22.0,
  "status": "Confirmed",
  "deliveredQuantity": 0,
  "deliveryDate": null
}
```

### 🔄 Stati Ordine

#### OrderStatus (Stato Testata)
- `Draft` (0) - Bozza
- `Confirmed` (1) - Confermato
- `InProduction` (2) - In produzione
- `Ready` (3) - Pronto
- `Shipped` (4) - Spedito
- `Delivered` (5) - Consegnato
- `Invoiced` (6) - Fatturato
- `Cancelled` (7) - Annullato
- `Returned` (8) - Reso

#### OrderItemStatus (Stato Riga)
- `Pending` (0) - In attesa
- `Confirmed` (1) - Confermato
- `InProduction` (2) - In produzione
- `Ready` (3) - Pronto
- `Shipped` (4) - Spedito
- `Delivered` (5) - Consegnato
- `BackOrder` (6) - In arretrato
- `Cancelled` (7) - Annullato

### 🔗 Relazioni Database
```
Customer 1 → N Orders
Order 1 → N OrderItems
OrderItem N → 1 Product
Product 1 → N Stock
User 1 → N (gestisce tutto)
```

### 📊 Flusso Logico
```
User (lavoratore)
  ↓
Gestisce Products (articoli)
  ↓
Controlla Stock (magazzino)
  ↓
Crea Orders per Customers (clienti)
  ↓
Aggiorna Stock automaticamente
  ↓
Traccia stati avanzamento
```

## �️ Codici di Stato

- `200` - Success
- `201` - Creato
- `204` - Nessun contenuto (cancellazione/aggiornamento)
- `400` - Richiesta non valida
- `401` - Non autorizzato
- `404` - Non trovato
- `409` - Conflitto (es. email già esistente)

## 📝 Esempi Frontend

### Creazione Ordine Completo
```javascript
// 1. Crea ordine con righe
const createOrder = async (customerId, items) => {
  const orderResponse = await fetch('/api/orders', {
    method: 'POST',
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      customerId: customerId,
      orderNumber: `ORD-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
      deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      items: items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.price
      }))
    })
  });
  
  return await orderResponse.json();
};

// 2. Aggiorna stato ordine
const updateOrderStatus = async (orderId, status) => {
  await fetch(`/api/orders/${orderId}/status`, {
    method: 'PUT',
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ status })
  });
};

// 3. Aggiorna stato singola riga
const updateItemStatus = async (orderId, itemId, status) => {
  await fetch(`/api/orders/${orderId}/items/${itemId}/status`, {
    method: 'PUT',
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ status })
  });
};
```

### Gestione Clienti
```javascript
// Lista clienti
const getCustomers = async () => {
  const response = await fetch('/api/customers', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return await response.json();
};

// Nuovo cliente
const createCustomer = async (customerData) => {
  const response = await fetch('/api/customers', {
    method: 'POST',
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      code: `CLI-${Math.floor(Math.random() * 1000)}`,
      name: customerData.name,
      email: customerData.email,
      phone: customerData.phone,
      address: customerData.address,
      vat: customerData.vat
    })
  });
  return await response.json();
};
```

### Dashboard Stati
```javascript
// Statistiche ordini per stato
const getOrderStats = async () => {
  const response = await fetch('/api/orders/stats', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return await response.json();
  // Esempio risposta:
  // {
  //   "total": 150,
  //   "byStatus": {
  //     "Draft": 5,
  //     "Confirmed": 25,
  //     "InProduction": 30,
  //     "Ready": 20,
  //     "Shipped": 15,
  //     "Delivered": 45,
  //     "Cancelled": 10
  //   }
  // }
};
```

### cURL
```bash
# Login
curl -X POST http://localhost:5256/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Crea cliente
curl -X POST http://localhost:5256/api/customers \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "CLI-001",
    "name": "SRL Italia",
    "email": "info@client.it",
    "phone": "+39 0123456789",
    "address": "Via Roma 1, Milano",
    "vat": "IT12345678901"
  }'

# Crea ordine
curl -X POST http://localhost:5256/api/orders \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "customer-guid-here",
    "orderNumber": "ORD-2024-001",
    "deliveryDate": "2024-02-28T00:00:00Z",
    "items": [
      {
        "productId": "product-guid-here",
        "quantity": 2,
        "unitPrice": 750.00
      }
    ]
  }'

# Aggiorna stato ordine
curl -X PUT http://localhost:5256/api/orders/order-guid-here/status \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "InProduction"}'
```

## 🗄️ Database

- **Tipo**: SQLite
- **File**: `inventory.db`
- **Seed**: Dati iniziali caricati automaticamente

## 🔧 Configurazione

### JWT Settings (appsettings.json)
```json
{
  "Jwt": {
    "Key": "YourSecretKeyHere123456789012345678901234",
    "Issuer": "InventoryApi",
    "Audience": "InventoryApiUsers"
  }
}
```

### Connection String
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=inventory.db"
  }
}
```

## 🚨 Note Importanti

1. **Password hashing**: SHA256 (da migliorare con bcrypt in produzione)
2. **Token JWT**: Validità 7 giorni
3. **CORS**: Configurare per frontend su dominio diverso
4. **HTTPS**: Usare in produzione
5. **Stati Ordine**: Testata e righe possono avere stati diversi
6. **Stock**: Aggiornato automaticamente da ordini confermati
7. **Archiviazione**: Ordini archiviati non appaiono in liste default
8. **Numerazione**: Ordini e clienti con codici auto-generati

## 📱 Test Rapido - Workflow Completo

1. **Avvia server**: `dotnet run`
2. **Vai a Swagger**: `http://localhost:5256/swagger`
3. **Registra utente**: `POST /api/users`
4. **Fai login**: `POST /api/auth/login` → copia token
5. **Crea cliente**: `POST /api/customers` (con token)
6. **Crea prodotto**: `POST /api/products` (se non esiste)
7. **Crea stock**: `POST /api/stocks` (quantità iniziale)
8. **Crea ordine**: `POST /api/orders` con righe
9. **Aggiorna stati**: `PUT /api/orders/{id}/status`
10. **Traccia avanzamento**: Dashboard stati ordini

## 🎯 Funzionalità Avanzate

### Filtri e Ricerca
```javascript
// Ordini per cliente
const getOrdersByCustomer = async (customerId) => {
  const response = await fetch(`/api/orders?customerId=${customerId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return await response.json();
};

// Ordini per stato
const getOrdersByStatus = async (status) => {
  const response = await fetch(`/api/orders?status=${status}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return await response.json();
};

// Ricerca clienti
const searchCustomers = async (query) => {
  const response = await fetch(`/api/customers?search=${query}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return await response.json();
};
```

### Validazioni Business
- **Stock disponibile**: Controlla quantità prima di creare ordine
- **Stati validi**: Solo transizioni consentite tra stati
- **Duplicati**: Controlla codici cliente/ordine unici
- **IVA calcolata**: Automatica base aliquote prodotto/cliente
