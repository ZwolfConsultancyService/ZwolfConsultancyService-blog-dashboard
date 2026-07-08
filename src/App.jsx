import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import { store } from "./store";
import Layout from "./component/Layout";
import BlogList from "./component/BlogList";
import BlogForm from "./component/BlogForm";
import BlogDetail from "./component/BlogDetail";
import "./index.css";
import AdminDashboard from "./component/Appointmentpage/Admindashboard";
import CaseStudyDashboard from "./component/CaseStudyDashboard/CaseStudyDashboard";
import CaseStudyForm from "./component/CaseStudyDashboard/CaseStudyForm";

function App() {
  return (
    <Provider store={store}>
      <Router
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <div className="App">
          <Layout>
            <Routes>
              <Route path="/" element={<BlogList />} />
              <Route path="/create" element={<BlogForm />} />
              <Route path="/edit/:id" element={<BlogForm />} />
              <Route path="/blog/:id" element={<BlogDetail />} />
              <Route path="/appointment" element={<AdminDashboard />} />
              <Route path="/case-study" element={<CaseStudyDashboard />} />
              <Route path="/case-study/create" element={<CaseStudyForm />} />
              <Route path="/case-study/edit/:id" element={<CaseStudyForm />} />
            </Routes>
          </Layout>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#363636",
                color: "#fff",
              },
            }}
          />
        </div>
      </Router>
    </Provider>
  );
}

export default App;
