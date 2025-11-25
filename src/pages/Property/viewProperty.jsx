import React from "react";
import {
  X,
  Phone,
  Mail,
  MapPin,
  Globe,
  Calendar,
  Home,
  Edit,
} from "lucide-react";

const ViewProperty = ({
  show,
  onClose,
  onEdit,
  selectedUser,
  renderAmenityOrRule,
}) => {
  if (!show || !selectedUser) return null;
  

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start overflow-y-auto">
        <div className="bg-white rounded-lg w-full max-w-4xl mx-4 my-10 shadow-lg">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Property Details
              </h2>
              <button
                onClick={() => onClose()}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-start gap-6">
              <img
                src={selectedUser.mainImage}
                alt={selectedUser.name}
                className="w-full sm:w-56 h-40 object-cover rounded-lg shadow-sm"
              />
              <div className="flex-1">
                <h3 className="text-2xl font-semibold text-gray-900">
                  {selectedUser.name}
                </h3>
                <p className="text-gray-600">
                  {selectedUser.type?.toUpperCase() || "PROPERTY"}
                </p>

                <div className="flex flex-wrap gap-3 mt-3 text-sm">
                  <span
                    className={`px-3 py-1 rounded-full font-medium ${
                      selectedUser.isAvailable
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {selectedUser.isAvailable ? "Available" : "Unavailable"}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 font-medium">
                    ⭐ {selectedUser.rating || 0} / 5
                  </span>
                  <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 font-medium">
                    {selectedUser.type === "pg" ||
                    selectedUser.type === "apartment" ? (
                      <>₹{selectedUser.pricePerMonth} / month</>
                    ) : (
                      <>₹{selectedUser.pricePerNight} / night</>
                    )}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6 mt-8">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">
                  Contact Information
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>{selectedUser.contactNumber}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <a
                      href={`mailto:${selectedUser.email}`}
                      className="text-blue-600 hover:underline"
                    >
                      {selectedUser.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>
                      {selectedUser.address}, {selectedUser.city},{" "}
                      {selectedUser.state} - {selectedUser.pincode}
                    </span>
                  </div>
                  {selectedUser.website && (
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-gray-400" />
                      <a
                        href={selectedUser.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Visit Website
                      </a>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">
                  Property Details
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>
                      Added on:{" "}
                      {new Date(selectedUser.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Home className="w-4 h-4 text-gray-400" />
                    <span>Available Rooms: {selectedUser.availableRooms}</span>
                  </div>
                  {selectedUser.coordinates && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span>
                        Lat: {selectedUser.coordinates.lat}, Lng:{" "}
                        {selectedUser.coordinates.lng}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              {selectedUser.amenities?.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Amenities</h4>
                  <div className="flex flex-wrap gap-2 text-sm">
                    {selectedUser.amenities.map((a, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-gray-100 rounded-full text-gray-800"
                      >
                        {renderAmenityOrRule(a)}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedUser.rules?.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">
                    Property Rules
                  </h4>
                  <div className="flex flex-wrap gap-2 text-sm">
                    {selectedUser.rules.map((r, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-gray-100 rounded-full text-gray-800"
                      >
                        {renderAmenityOrRule(r)}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {selectedUser.images && selectedUser.images.length > 0 && (
              <div className="mt-8">
                <h4 className="font-medium text-gray-900 mb-3">Gallery</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {selectedUser.images.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt={`Image ${i + 1}`}
                      className="w-full h-32 object-cover rounded-lg hover:scale-105 transition"
                    />
                  ))}
                </div>
              </div>
            )}

            {selectedUser.rooms && selectedUser.rooms.length > 0 && (
              <div className="mt-8">
                <h4 className="font-medium text-gray-900 mb-3">Room Details</h4>
                <div className="space-y-3 text-sm text-gray-700">
                  {selectedUser.rooms.map((room, i) => (
                    <div
                      key={i}
                      className="border p-3 rounded-lg bg-gray-50 flex flex-col sm:flex-row justify-between"
                    >
                      <div>
                        <p className="font-medium capitalize">
                          {room.roomType} Room ({room.furnished})
                        </p>
                        <p>Occupancy: {room.occupancy}</p>
                        <p>Price: ₹{room.pricePerMonth || room.price}</p>
                        <p>
                          Amenities:{" "}
                          {room.amenities && Array.isArray(room.amenities)
                            ? room.amenities.map(renderAmenityOrRule).join(", ")
                            : "N/A"}
                        </p>
                      </div>
                      <div>
                        {room.images && room.images.length > 0 && (
                          <div
                            className="
        flex flex-wrap gap-2 mt-2 sm:mt-0 
        max-w-full 
        overflow-x-auto 
        p-1
      "
                            style={{ scrollbarWidth: "thin" }}
                          >
                            {room.images.map((img, index) => (
                              <img
                                key={index}
                                src={img}
                                alt={`Room ${i + 1} - Image ${index + 1}`}
                                className="
            w-32 h-24 object-cover rounded-lg 
            flex-shrink-0
          "
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ------------------------------------------------------break point -------------------------------- */}

            {/* Actions */}
            <div className="flex gap-3 mt-10 justify-end">
              <button
                onClick={() => onClose()}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={() => {
                 onEdit();
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit Property
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );}

  export default ViewProperty;