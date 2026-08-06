const styles = {
    //Buttons
    addButton: "rounded-md text-xs md:text-base bg-[#74A2BE] font-bold h-10 max-w-80 cursor-pointer shadow-xl hover:text-[#F1F2EB] hover:scale-105",
    alignAddButton: "grid place-items-right items-center",
    deleteButton: "hover:text-[#D01117] cursor-pointer shadow-xl",
    editButton: "hover:text-[#16697A] cursor-pointer shadow-xl",
    viewAssignButton: "rounded-md text-xs md:text-base border-2 border-[#16697A] font-bold h-10 max-w-80 px-2 cursor-pointer shadow-xl hover:text-[#74A2BE] hover:scale-105",

    //Table
    alignTable: "mx-auto overflow-x-auto p-4",
    tableBorder: "overflow-x-auto rounded-lg border-[#74A2BE] border-x-2 border-t-2 shadow-xl",
    tableHeader: "text-sm md:text-base lg:px-8 py-4 bg-[#ADBAC2] font-semibold",
    tableBody: "text-sm md:text-base text-center lg:px-8 border-[#74A2BE] border-b-2",
    tableRow: "hover:bg-[#a4c5db] transition-colors duration-400 ease-in-out h-16",

    //Assignment Table
    assignTableHeader: "text-sm md:text-base lg:px-4 py-4 bg-[#ADBAC2] font-semibold",
    assignTableBody: "text-sm md:text-base text-center lg:px-2 border-[#74A2BE] border-b-2",
    completedTableBody: "text-sm md:text-base text-center lg:px-2 border-[#679436] border-b-2",

    //Title and header
    title: "text-sm md:text-2xl text-center py-5 font-bold underline px-2",
    alignHeader: "grid grid-cols-3 mb-4",

    //Modal
    exitButton: "rounded-md text-xs md:text-base bg-[#ADBAC2] border-[#74A2BE] border-2 w-10 md:w-20 font-bold cursor-pointer shadow-xl hover:text-[#F1F2EB]",
    clearButton: "place-items-right rounded-md text-xs md:text-base bg-[#B3BFB8] w-10 md:w-20 font-bold cursor-pointer shadow-xl hover:text-[#F1F2EB]",
    submitButton: "rounded-md text-xs md:text-base bg-[#679436] w-12 md:w-20 font-bold cursor-pointer shadow-xl hover:text-[#F1F2EB] justify-self-end",
    label: "text-xs md:text-base font-bold py-2",
    inputBox: "rounded-md text-xs md:text-base border px-1",
    dropdown: "bg-[#F1F2EB] border rounded-md text-xs md:text-base max-w-15 md:max-w-46",
    message: "text-xs md:text-base text-center pt-4 min-h-10",
    deleteText: "text-xs md:text-base text-center font-bold",
    yes: "rounded-md cursor-pointer w-12 md:w-20 justify-self-center text-xs md:text-base bg-[#D01117] hover:text-[#F1F2EB] hover:scale-105",
    no: "rounded-md cursor-pointer w-12 md:w-20 justify-self-center text-xs md:text-base bg-[#B3BFB8] hover:text-[#F1F2EB] hover:scale-105",

};

export default styles;