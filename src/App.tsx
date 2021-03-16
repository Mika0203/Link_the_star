import LinkTheStar from "./LinkTheStar";

const sampleData : Array<Array<number>> = [
  [4,1,0,0,1],
  [0,2,0,0,3],
  [0,0,3,2,4],
  [0,0,0,0,0],
  [0,0,0,0,0],
];

function App() {
  return (
    <div className="App">
      <LinkTheStar plateData={sampleData} />
    </div>
  );
}

export default App;
