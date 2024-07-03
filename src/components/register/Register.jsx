import NormalBtn from "../butttons/Normal/NormalBtn";
import FormComponent from "../form/form";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Register.css";

const Register = () => {
  const componentInputs = [
    {
      title: "نام و نام خانوادگی",
      name: "fullname",
      type: "text",
      validationSchema: Yup.string()
        .min(5, "لطفا حداقل پنج حرف وارد کنید")
        .required("این فیلد اجباری است"),
      initialValue: "",
    },
    {
      title: "شماره تماس",
      name: "phonenumber",
      type: "text",
      validationSchema: Yup.string()
        .matches(/^\d{11}$/, "لطفا تلفن معتبر وارد کنید")
        .required("این فیلد اجباری است"),
      initialValue: "",
    },
    {
      title: "ایمیل",
      name: "email",
      type: "email",
      validationSchema: Yup.string()
        .email("لطفا ایمیل معتبر وارد کنید")
        .required("این فیلد اجباری است"),
      initialValue: "",
    },
    {
      title: "کدملی",
      name: "nationalcode",
      type: "text",
      validationSchema: Yup.string()
        .matches(/^\d{10}$/, "لطفا کدملی معتبر وارد کنید")
        .required("این فیلد اجباری است"),
      initialValue: "",
    },
  ];

  const navigate = useNavigate();

  const handleSubmit = (values) => {
    const { fullname, phonenumber, email, nationalcode } = values;

    // ارسال درخواست به API Flask برای ذخیره اطلاعات کاربر
    axios
      .post("http://127.0.0.1:5000/api/register", {
        fullname,
        phonenumber,
        email,
        nationalcode,
      })
      .then((response) => {
        if (response.data.success) {
          // اگر ثبت‌نام موفقیت‌آمیز بود، به صفحه مورد نظر هدایت شوید
          navigate("/services");
        } else {
          // اگر ثبت‌نام ناموفق بود، پیغام خطا نمایش داده شود
          console.error("Registration failed");
        }
      })
      .catch((error) => {
        console.error("Error registering the user", error);
      });
  };

  return (
    <>
      <header className="m-4 flex items-center justify-end">
        <section className="">
          <NormalBtn title={`تغییر کد ورودی`} path={`/`} />
        </section>
      </header>
      <div className="rounded-3xl p-4 max-w-60 w-fit flex flex-col justify-center items-center absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
        <header>
          <img
            src="src/assets/radical-logo-white.png"
            className="w-32 h-32"
            alt="radical logo"
          />
        </header>
        <main className="text-center">
          <h1 className="text-h1 font-iranSans text-background-elm">رادیکال</h1>
          <p className="text-background-white">
            مشخصات خود را برای بهره وری از خدمات وارد کنید
          </p>
          <FormComponent
            inputs={componentInputs}
            btn={<NormalBtn title={`مرحله بعد`} />}
            onSubmit={handleSubmit}
          />
        </main>
      </div>
    </>
  );
};

export default Register;
