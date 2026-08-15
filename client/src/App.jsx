import CreateSnippet from "./components/CreateSnippet"
import Navbar from "./components/Navbar"

function App() {

  return (
    <main className="container max-w-4xl p-4 mx-auto">
      <Navbar />
      <CreateSnippet />
    </main>
  )
}

export default App
