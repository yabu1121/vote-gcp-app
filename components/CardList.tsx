import Card from "./Card"

const CardList = () => {
  const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];
  const dummyProps = {
    title: "サンプルアンケート",
    choices: ["選択肢A", "選択肢B", "選択肢C", "選択肢D"]
  };

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {items.map((item) => (
        <Card key={item} title={`${dummyProps.title} ${item}`} choices={dummyProps.choices} />
      ))}
    </div>
  )
}

export default CardList