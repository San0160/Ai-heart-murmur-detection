import { useState } from "react";

function App() {

  const [prediction, setPrediction] = useState("Waiting...");
  const [confidence, setConfidence] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);

  const loadSample = async (sampleName) => {

  const response = await fetch(`http://localhost:5173/samples/${sampleName}`);

  const blob = await response.blob();

  console.log("Blob:");
  console.log(blob);
  console.log("Blob size:", blob.size);
  console.log("Blob type:", blob.type);

  const file = new File(
    [blob],
    sampleName,
    { type: "audio/wav" }
  );

  console.log("File:");
  console.log(file);
  console.log("File size:", file.size);
  console.log("File type:", file.type);

  setSelectedFile(file);

};

  const handlePrediction = async () => {

    if (!selectedFile) {
      alert("Please select a WAV file.");
      return;
    }
    const formData = new FormData();
    formData.append("file", selectedFile);

    const response = await fetch(
      "https://ai-heart-murmur-detection-1.onrender.com/predict",
      {
        method: "POST",
        body: formData,
      }
    );

    console.log(response.status);

    const result = await response.json();

    console.log(result);

    setPrediction(result.prediction);
    setConfidence(result.confidence);

  };

  return (
    <div>

      <h1>Heart Murmur Detection</h1>

      <h2>{prediction}</h2>

      <p>Confidence : {confidence}%</p>

      <input 
        type = "file" 
        onChange={(event) => setSelectedFile(event.target.files[0])}
      />

      <h3>Try Sample Audio</h3>

      <button onClick={() => loadSample("Normal.wav")}>
        Normal
      </button>

      <button onClick={() => loadSample("Murmur.wav")}>
        Murmur
      </button>

      <button onClick={() => loadSample("Artifact.wav")}>
        Artifact
      </button>

      <p>{selectedFile?.name}</p>

      <button onClick = {handlePrediction}>
        Predict
      </button>

      <h2>{prediction}</h2>

      <p>Confidence : {confidence}%</p>

    </div>
  );
}

export default App;
