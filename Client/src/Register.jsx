const handleRegister = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
        const response = await fetch("http://localhost:5000/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                role,
                password,
            }),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            alert(data.message || "Registration failed");
            return;
        }

        alert("Registration successful!");

        // Optional: redirect to login
        navigate("/login");

    } catch (error) {
        console.error(error);
        alert("Server connection failed");
    } finally {
        setLoading(false);
    }
};