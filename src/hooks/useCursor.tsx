const useCursor = () => {
  const changeCursorContent = (innerHtml: string) => {

    const cursor = document.querySelector("#cursor");
    if (cursor) {
      cursor.innerHTML = innerHtml;
    }
  };

  return { changeCursorContent };
};
export default useCursor;
