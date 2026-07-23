import { NavBar } from "../components/NavBar";
import { Footer } from "../components/footer";
import SupportPage from "../components/Support/SupportPage";

function Support() {
    return (
        <>
            <NavBar />
            <main>
                <SupportPage />
            </main>
            <Footer />
        </>
    );
}

export default Support;