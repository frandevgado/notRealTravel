document.addEventListener('DOMContentLoaded', () =>{
    fetchData()
    if(localStorage.getItem('cart')){
        cart = JSON.parse(localStorage.getItem("cart"))
        
    }
})

const navCartNumber = document.getElementById('cart-number')

// hamburger menu variables
const navBar = document.getElementById('navbar')
const navMenu = document.getElementById('navbar-menu')
const navHamburger = document.getElementById('bars-menu')
const lineOne = document.getElementById('bar-line-top')
const lineTwo = document.getElementById('bar-line-middle')
const lineThree = document.getElementById('bar-line-bottom')
const alertCircle = document.createElement('DIV')

// item list variables
const productItemsContainer = document.getElementById('products-container')
const cardTemplate = document.getElementById('card-template').content

const fragment = document.createDocumentFragment()

// modal variables
const closeM = document.querySelector('.close')
const openM = cardTemplate.querySelector('.cta')
const modal = document.querySelector('.modal')
const modalC = document.querySelector('.modal-container')

// item detail variables
const detailTitle = document.getElementById('detail-title')
const detailImg = document.getElementById('detail-img')
const detailDescription = document.getElementById('description')
const detailCheckIn = document.getElementById('detail-checkin')
const detailCheckOut = document.getElementById('detail-checkout')
const detailPrice = document.getElementById('detail-price')

const hamburgerMenu = () =>{
    navHamburger.addEventListener('click', displayMenu)
}

alertCircle.className = 'alert-circle'
const alertNotification = (cart) =>{
    if(cart.length !==0){
        navHamburger.appendChild(alertCircle)
    }
}

const displayMenu = () =>{
    alertCircle.classList.toggle('disabled')
    lineOne.classList.toggle('activebars-menu__line--top')
    lineTwo.classList.toggle('activebars-menu__line--middle')
    lineThree.classList.toggle('activebars-menu__line--bottom')
    navMenu.classList.toggle('active')
    navBar.classList.toggle('active')
}

    const fetchData = async () =>{
        try{
            const res = await fetch ('/products.json')
            const data = await res.json()
            printCards(data)
        } catch (error) {
            console.log(error)
        }
    }

    
    document.addEventListener('DOMContentLoaded', () =>{
        fetchCart()
        hamburgerMenu()
    })
    
    const fetchCart = () =>{
        if(localStorage.getItem('cart')){
            const cart = JSON.parse(localStorage.getItem('cart'))     
            navCartQuantity(cart)
            alertNotification(cart)
        }
    }
    
    const navCartQuantity = (cart) =>{
        let quantities = []
        cart.forEach(prod =>{
            quantities.push(prod.quantity)
        })
        let totalQuantInCart = quantities.reduce((acc,value) => acc + value, 0)
        navCartNumber.innerHTML = `<i class="fa-solid fa-earth-americas"></i> Mis viajes <span class="cart-number">+${totalQuantInCart}</span>`
        if(totalQuantInCart === 0){
            navCartNumber.innerHTML = `<i class="fa-solid fa-earth-americas"></i> Mis viajes`
        }
    }
    
    const printCards = data =>{
        if(location.pathname === '/pages/destinos.html'){
        data.forEach(product =>{
            cardTemplate.querySelector('.card-container').setAttribute('id', product.id)
            cardTemplate.querySelector('h3').textContent = product.name
        cardTemplate.querySelector('h5').innerHTML = `Precio: <span> $</span><span>${product.price}</span>`
        cardTemplate.querySelector('img').setAttribute("src", product.img)
        cardTemplate.querySelector('.cta').dataset.id = product.id
        cardTemplate.querySelector('.btn--buy').dataset.name = product.name
        cardTemplate.querySelector('.card__check--in').textContent = `Desde: ${product.checkin}`
        cardTemplate.querySelector('.card__check--out').textContent = `Hasta: ${product.checkout}`

        const clone = cardTemplate.cloneNode(true)
        fragment.appendChild(clone)
        })
    } else if(location.pathname === '/pages/argentina.html'){
        const desArg = data.filter(prod => prod.category == 'argentina')
        printByCategory(desArg)
    } else if(location.pathname === '/pages/brasil.html'){
    const desBr = data.filter(prod => prod.category == 'brazil')
    printByCategory(desBr)
    } else if(location.pathname === '/pages/caribe.html'){
        const desCar = data.filter(prod => prod.category == 'caribbean')
        printByCategory(desCar)
    } else if(location.pathname === '/pages/sudamerica.html'){
        const desSouthA = data.filter(prod => prod.category == 'south america')
        printByCategory(desSouthA)
    } else if(location.pathname === '/pages/europa.html'){
        const desEurope = data.filter(prod => prod.category == 'europe')
        printByCategory(desEurope)
    } else if(location.pathname === '/pages/exotico.html'){
        const desExotic = data.filter(prod => prod.category == 'exotic')
        printByCategory(desExotic)
    } 
    productItemsContainer.appendChild(fragment)
}

const printByCategory = (destinations) =>{
destinations.forEach(product =>{
    cardTemplate.querySelector('.card-container').setAttribute('id', product.id)
    cardTemplate.querySelector('h3').textContent = product.name
    cardTemplate.querySelector('h5').innerHTML = `Precio: <span> $</span><span>${product.price}</span>`
    cardTemplate.querySelector('img').setAttribute("src", product.img)
    cardTemplate.querySelector('.cta').dataset.id = product.id
    cardTemplate.querySelector('.btn--buy').dataset.name = product.name
    cardTemplate.querySelector('.card__check--in').textContent = `Desde: ${product.checkin}`
    cardTemplate.querySelector('.card__check--out').textContent = `Hasta: ${product.checkout}`

    const clone = cardTemplate.cloneNode(true)
    fragment.appendChild(clone)
})
}

// LOGIC - MODAL / DETAIL
const setProductDetail = object =>{
   const product = {
    id: object.querySelector('.cta').dataset.id,
    name: object.querySelector('h3').textContent,
    img: object.querySelector('img').getAttribute('src'),
    price: object.querySelector('h5').textContent,
    checkin: object.querySelector('.card__check--in').textContent,
    checkout: object.querySelector('.card__check--out').textContent,
   }
    printProductDetail(product)
}

const printProductDetail = (product) => {
    detailTitle.textContent = product.name
    detailImg.setAttribute('src', product.img)
    detailTitle.textContent = product.name
    detailPrice.textContent = product.price
    detailCheckIn.textContent = product.checkin
    detailCheckOut.textContent = product.checkout
}
productItemsContainer.addEventListener('click', (e) =>{
    if(e.target.dataset.id){
        e.preventDefault()
        setProductDetail(e.target.parentElement.parentElement)
        modalC.style.opacity = "1"
        modalC.style.visibility = "visible"
        modal.classList.toggle("modal--close")
    }else if(e.target.dataset.name) {
        
        e.preventDefault()
        addToCart(e.target.parentElement.parentElement)
        navCartQuantity(cart)
        alertNotification(cart)
        Swal.fire({
            title: 'Éxito',
            text: 'Agregaste el destino al carrito',
            icon: 'success',
            confirmButtonText: 'Cerrar'
          })
    }
    e.stopPropagation()
})

const updateLocalStorage = (value) => localStorage.setItem("cart", JSON.stringify(value))

const closeModal = (e) =>{
    modal.classList.toggle("modal--close")

    setTimeout(() =>{
        modalC.style.opacity = "0"
        modalC.style.visibility = "hidden"
    },800)

}

closeM.addEventListener( "click", (e) =>{
    closeModal()
    e.stopPropagation()})

modalC.addEventListener('click', (e) =>{
    if(e.target.classList.contains('modal-container')) closeModal()
})

//  LOGIC - ADD TO CART **
    const idIsInCart = (id) => cart.some( prod => prod.id === id) 
    
    let cart = []
    
    const addToCart = (object) =>{
        const product = {
            id: object.querySelector('.cta').dataset.id,
            name: object.querySelector('h3').textContent,
            img: object.querySelector('img').getAttribute('src'),
            price: object.querySelector('h5').children[1].textContent,
            checkin: object.querySelector('.card__check--in').textContent,
            checkout: object.querySelector('.card__check--out').textContent,
           }

        const productToCart = {...product, quantity: 1}
        if(idIsInCart(object.id)){
            let index = cart.findIndex(i => i.id === productToCart.id )
            let product = cart[index]
            product.quantity = product.quantity + 1
            localStorage.setItem("cart", JSON.stringify(cart))
        }else{
            cart.push(productToCart)
            localStorage.setItem("cart", JSON.stringify(cart))
        }
    }