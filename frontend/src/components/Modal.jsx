function Modal({ children, type }) {

    //Changes the border colour
    let border;
    if (type === "add"){
        border = "#679436";
    } else if (type === "delete"){
        border = "#D01117";
    } else {
        border = "#74A2BE";
    }

    return(
        <div className="grid place-items-center p-2 fixed inset-0 bg-black/50 ">
            <div style={{ borderColor: border}} className="grid bg-[#F1F2EB] p-8 md:px-12 md:pt-12 w-50 md:w-120 rounded-xl shadow-2xl border-3">
                {children}
            </div>
        </div>
    )
}

export default Modal;