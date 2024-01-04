import "./Menu.css";
const Menu = (props) => {
  const image = props.src;
  const imageArray = image.menus;
  if (imageArray === null) {
    return "";
  }
  return props.trigger ? (
    <div className="menu" onClick={() => props.setTrigger(false)}>
      {imageArray.map((image) => (
        <div className="menu-item">
          <img
            className="menu-img"
            src={"http://localhost:3000/static/" + image}
            alt="image"
          />
        </div>
      ))}
    </div>
  ) : (
    ""
  );
};

export default Menu;
