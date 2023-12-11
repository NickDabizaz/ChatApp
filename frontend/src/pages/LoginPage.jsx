import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useFetcher, useLoaderData, useNavigate, redirect } from "react-router-dom";

function LoginPage() {
  const loaderData = useLoaderData();
  const navigate = useNavigate();
  console.log(loaderData);
  const [pesanError, setPesanError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const fetcher = useFetcher();

  // console.log({ users: loaderData.Users.data });

  const handleLogin = (data) => {
    const isAda = loaderData.find((u) => u.phoneNumber === data.phoneNumber);
    console.log(isAda);
    if (isAda) {
        fetcher.submit(data, {
          method: "POST",
          action: "/login",
        });
    } else {
      setPesanError("user tidak ditemukan");
    }
  };
  
  return <div className="container d-flex justify-content-center align-items-center vh-100">
    <div className="card p-4" style={{ width: "50%" }}>
      <h2 className="fs-2 text-center mb-3">Login</h2>
      <form onSubmit={handleSubmit(handleLogin)}>
        <div className="mb-3">
          <label htmlFor="phoneNumber" className="form-label">
          Phone Number
          </label>
          <input
            type="text"
            className={`form-control ${errors.phoneNumber ? "is-invalid" : ""}`}
            id="phoneNumber"
            {...register("phoneNumber", { required: "Phone Number Harus Diisi" })}
          />
          {errors.phoneNumber && (
            <p className="text-danger">{errors.phoneNumber.message}</p>
          )}
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className={`form-control ${errors.password ? "is-invalid" : ""}`}
            id="password"
            {...register("password", { required: "Password Harus Diisi" })}
          />
          {errors.password && (
            <p className="text-danger">{errors.password.message}</p>
          )}
        </div>
        <button className="btn btn-primary" style={{ width: "100%" }}>Login</button>
      </form>
      <div className="mt-3">
        <Link to={"/register"}>
          <button className="btn btn-secondary" style={{ width: "100%" }}>Ke Register</button>
        </Link>
      </div>
      <div className="mt-2 text-danger">{pesanError}</div>
    </div>
  </div>

}

export default LoginPage;
