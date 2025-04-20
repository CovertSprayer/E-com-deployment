document.addEventListener("click", (e) => {
  if(e.target.classList.contains("fa-heart")){
    const productId = e.target.getAttribute("productId");
    updateWishList(productId, e.target);
  }
})

async function updateWishList(productId, element){
  try {
    const res = await axios.post(`api/products/${productId}/wishlist`, {}, {
      headers: {'X-Requested-With': 'XMLHttpRequest'}
    });
    if(res.status === 200 && res.data.success === true){
      revertIcon(element);
    }
  } catch (error) {
    if(error.response.status == 401)
      window.location.replace("/login");
  }
}

function revertIcon(element){
  if(element.classList.contains("fa-regular")){
    element.classList.remove("fa-regular");
    element.classList.add("fa-solid");
  }
  else{
    element.classList.remove("fa-solid");
    element.classList.add("fa-regular");
  }
}