 function createEle(name,classList,styleObj) {
   let dom = document.createElement(name)
   for (let i = 0; i < classList.length; i++) {
     dom.classList.add(classList[i])
   }
   for (const key in styleObj) {
     dom.style[key] = styleObj[key] 
     }
   return dom
 }
 function setLocal(key,value) {
   if (typeof value === 'object' && value !== null) {
     value = JSON.stringify(value)
   }
   localStorage.setItem(key,value)
 }
 function getLocal(key) {
   let value =  localStorage.getItem(key)
   if (value === null) {
     return value
   }
   if (value[0] === '[' || value[0] === '{') {
    return JSON.parse(value) 
   }
   return value
}