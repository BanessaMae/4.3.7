
const list = document.querySelector('ul');
const filter = document.querySelector('#filter');
let USERS = [];
const users = document.querySelector(".dropdown__users");


filter.addEventListener('input', (event)=>{
    const value  = event.target.value.toLowerCase();
    const filteredUsers = (USERS || []).filter((user) => 
        user.name.toLowerCase().includes(value)
)
    render(filteredUsers);
})


filter.addEventListener('input', async function (event) {
    const value  = event.target.value;
    let api = searchUsers(value);
    let res = await api.items;
    let names = (res || []).forEach((obj)=>{
        return list.insertAdjacentHTML('afterbegin', `toHTML()`)
    })
    return  (names);
})


async function searchUsers(value){
    list.innerHTML = 'Loading';
     try{
     const resp = await fetch(`https://api.github.com/search/repositories?q=${value}&per_page=5`)
    const data = await resp.json();
        USERS = data.items;
        render (data.items);
    } catch(err){
        list.innerHTML = 'err.message';
    }
}


function render (users =[]){
    if(users.length === 0){
        list.innerHTML = '';
    }else if (filter.value== ''){
        removePredictions();
    }else{
    const html = users.map(toHTML).join('');
    list.innerHTML = html;
    }
}

function toHTML(user){
    let li = `<li class="list-group-item" data-owner="${user.owner.login}" data-stars="${user.stargazers_count}">${user.name} </li>`;;
    return li;

}


searchUsers();


list.addEventListener("click", function (event) {
    let target = event.target;
    if (!target.classList.contains("list-group-item")) {
      return; 
    }
    addChosen(target);
    filter.value = ""; 
    removePredictions(); 
  });
  

  function removePredictions() {
    list.innerHTML = "";
  }


  function addChosen(target) {
    let name = target.textContent;
    let owner = target.dataset.owner;
    let stars = target.dataset.stars;
    users.innerHTML += `<div class="chosen">Name: ${name}<br>Owner: ${owner}<br>Stars: ${stars}<button class="btn-close"></button></div>`;
  }

  
  users.addEventListener("click", function (event) {
    let target = event.target;
    if (!target.classList.contains("btn-close")) {
      return; 
  }
    target.parentElement.remove(); 
  });


  function debounce(fn, timeout) {
    let timer = null;
  
    return (...args) => {
      clearTimeout(timer);
      return new Promise((resolve) => {
        timer = setTimeout(() => resolve(fn(...args)), timeout);
      });
    };
  }

const getPredictionsDebounce = debounce(searchUsers, 100);
filter.addEventListener("input", getPredictionsDebounce);


  
 




