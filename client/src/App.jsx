import { useState } from "react";
import Table from "./components/Table";
import Form from "./components/Form";
import Footer from "./components/Footer";
import "./styles.css"; 

function App() {
  const [refresh, setRefresh] = useState(1);

  const handleOnRefresh = () => {
    setRefresh(refresh + 1);
  };

  return (
    <div className="p-5">

<h1 className="fs-1 text-warning text-center">Dashboard Player</h1>
<p className="fs-5 text-warning text-center"> Halo Admin!!</p>

      <Form onRefresh={handleOnRefresh} />
      <br />
      <Table refresh={refresh} />
      <Footer />
    </div>
  );
}

export default App;
