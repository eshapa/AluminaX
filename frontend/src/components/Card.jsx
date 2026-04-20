export default function Card({ children }) {
  return (
    <div style={{
      background: "white",
      padding: "15px",
      margin: "10px",
      borderRadius: "10px",
      boxShadow: "0 0 10px rgba(0,0,0,0.1)"
    }}>
      {children}
    </div>
  );
}