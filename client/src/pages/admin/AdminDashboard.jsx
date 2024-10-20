import AllComparisons from "../../components/admin/AllComparisons";
import SetIteration from "../../components/admin/SetIteration";
import AllResult from "../../components/AllResult";

export default function AdminDashboard() {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <div className="set-iteration">
        <SetIteration />
      </div>

      <div className="all-comparisons">
        <AllComparisons />
      </div>

      <div className="all-result">
        <AllResult />
      </div>
    </div>
  )
}
