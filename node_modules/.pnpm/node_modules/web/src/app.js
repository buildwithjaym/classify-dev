import { LoginPage } from "./routes/LoginPage";
import { TodayPage } from "./routes/student/TodayPage";

export function App() {
    const el = document.createElement("div");
    el.className = "app";

    function render(node) {
        el.innerHTML = "";
        el.appendChild(node);
    }

    render(LoginPage({
        onLoggedIn: (profile) => {
            if (profile.role === "student") {
                render(TodayPage({ studentUserId: profile.user_id }));
            } else {
                const div = document.createElement("div");
                div.innerHTML = `<h2>Logged in as ${profile.role}</h2><p>Next pages will be built next.</p>`;
                render(div);
            }
        }
    }));

    return el;
}
