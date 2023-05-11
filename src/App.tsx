let aparts = Array.from({ length: 18 }, (_, i) => i + 1);

function App() {
  return (
    <div className="max-w-md mx-auto">
      <h1 className="">Kenesary</h1>
      <div className="grid grid-cols-3 gap-4">
        {aparts.map((item) => (
          <div>{item}</div>
        ))}
      </div>
    </div>
  );
}

export default App;
