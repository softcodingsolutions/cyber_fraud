"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Trophy, User, Mail, MapPin, Phone, Sparkles } from "lucide-react";
import { City, State } from "country-state-city";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

export default function WinnerForm({ onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    city: "",
    mobile: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    city: "",
    mobile: "",
  });
  const MySwal = withReactContent(Swal);
  const [gujaratCities, setGujaratCities] = useState([]);

  useEffect(() => {
    // Get Gujarat ISO code and fetch cities
    const gujarat = State.getStatesOfCountry("IN").find(
      (state) => state.name === "Gujarat"
    );

    if (gujarat) {
      const cities = City.getCitiesOfState("IN", gujarat.isoCode);
      setGujaratCities(cities);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      name: !formData.name ? "Name is required" : "",
      email: !formData.email
        ? "Email is required"
        : !/\S+@\S+\.\S+/.test(formData.email)
        ? "Email is invalid"
        : "",
      city: !formData.city ? "Please select a city" : "",
      mobile: !formData.mobile
        ? "Mobile number is required"
        : !/^[0-9]{10}$/.test(formData.mobile)
        ? "Mobile number must be 10 digits"
        : "",
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const payload = {
          email: formData.email,
          mobileno: formData.mobile,
          name: formData.name,
          city: formData.city,
          date: new Date().toLocaleDateString("en-GB"),
        };
        const res = await axios.post("/winnerregister", payload);

        MySwal.fire({
          icon: "success",
          title: "<strong>Congratulations!</strong>",
          html: `
              <p>Your winner details have been <b>successfully submitted!</b></p>
              <p>We will contact you <span style="color:green;">soon</span>.</p>
              <p>If any query, mail us at 
                <a href="mailto:spin-win@filmansh.com" style="color:blue;">spin-win@filmansh.com</a>.
              </p>
            `,
        }).then(() => {
          onClose();
        });
      } catch (error) {
        const message = error.response.data.message || "Something went wrong";
        MySwal.fire({
          icon: "error",
          title: "Oops...",
          text: message,
        }).then(() => {
          onClose();
        });
      }
    }
  };

  return (
    <div className="relative shadow-lg border rounded-lg overflow-hidden bg-white md:min-w-[70vw] min-w-[100vw] !max-w-md mx-auto">
      <div className="absolute inset-0 bg-gradient-to-r from-rose-100/30 to-teal-100/30 z-0" />

      {/* Header */}
      <div className="relative z-10 bg-gradient-to-r from-rose-500 to-teal-500 p-6 text-white">
        <div className="flex items-center justify-between">
          <h2 className="md:text-2xl text-xl font-bold flex items-center justify-center gap-4">
            <Trophy className="h-6 w-6" />
            Winner Registration
          </h2>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-200" />
            <a
              href="https://filmansh.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs  text-amber-200 hover:text-amber-300"
            >
              filmansh.com
            </a>
          </div>
        </div>
        <p className="text-sm text-white/80 mt-1 italic">
          Congratulations! You have won <br className="block md:hidden" />
          <span className="font-bold text-amber-200">"2 free tickets"</span> of
          Shatra Movie
        </p>
        <p>Please complete your details</p>
      </div>

      {/* Form */}
      <div className="relative z-10 p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name */}
          <div className="space-y-1">
            <label
              htmlFor="name"
              className="flex items-center gap-1.5 text-gray-700 text-sm font-medium"
            >
              <User className="h-4 w-4 text-rose-500" />
              Full Name
            </label>
            <input
              id="name"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-teal-400 ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-xs">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label
              htmlFor="email"
              className="flex items-center gap-1.5 text-gray-700 text-sm font-medium"
            >
              <Mail className="h-4 w-4 text-rose-500" />
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="your.email@example.com"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-teal-400 ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs">{errors.email}</p>
            )}
          </div>

          {/* City */}
          <div className="space-y-1">
            <label
              htmlFor="city"
              className="flex items-center gap-1.5 text-gray-700 text-sm font-medium"
            >
              <MapPin className="h-4 w-4 text-rose-500" />
              City
            </label>
            <select
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-teal-400 ${
                errors.city ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Select your city</option>
              {gujaratCities.map((city) => (
                <option key={city.name} value={city.name}>
                  {city.name}
                </option>
              ))}
            </select>
            {errors.city && (
              <p className="text-red-500 text-xs">{errors.city}</p>
            )}
          </div>

          {/* Mobile Number */}
          <div className="space-y-1">
            <label
              htmlFor="mobile"
              className="flex items-center gap-1.5 text-gray-700 text-sm font-medium"
            >
              <Phone className="h-4 w-4 text-rose-500" />
              Mobile Number
            </label>
            <input
              id="mobile"
              name="mobile"
              placeholder="10-digit mobile number"
              value={formData.mobile}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-teal-400 ${
                errors.mobile ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.mobile && (
              <p className="text-red-500 text-xs">{errors.mobile}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 bg-gradient-to-r from-rose-500 to-teal-500 text-white rounded hover:from-rose-600 hover:to-teal-600 transition-all duration-300"
          >
            Submit Winner Details
          </button>
        </form>
        <div className="mt-6 text-center text-xs text-gray-500">
          If you have any query, please contact on mail: <br />
          <a
            href="mailto:spin-win@filmansh.com"
            className="text-rose-500 italic hover:text-rose-600"
          >
            spin-win@filmansh.com
          </a>
        </div>
      </div>
    </div>
  );
}
