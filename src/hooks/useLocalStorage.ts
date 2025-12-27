export const useLocalStorage = () => {


  const saveToLocalStorage = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  }

  const removeFromLocalStorage = (key) => {
    const findedItem = localStorage.getItem(key);
    if (!findedItem) {
      console.log("item not found!")
      return;
    }
    localStorage.removeItem(key);
    console.log("remove success!")
  }




  return {
    saveToLocalStorage,
    removeFromLocalStorage
  }
}