import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import Sidebar from "../components/Sidebar"

function MainLayout({ children, activePage, setActivePage }) {
  return (
    <div>
      <Navbar />
      <div className="main-content-wrapper">
        <Sidebar activePage={activePage} setActivePage={setActivePage} />
        <div className="main-content">
          {children}
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default MainLayout