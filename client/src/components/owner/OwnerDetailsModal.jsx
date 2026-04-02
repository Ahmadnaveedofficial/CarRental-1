import { X, Phone, Mail, User } from 'lucide-react';

const OwnerDetailsModal = ({ selectedOwner, onClose }) => {
  if (!selectedOwner) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-md w-full shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div className="flex items-center gap-2">
            <User size={20} className="text-primary" />
            <h2 className="text-lg font-bold text-gray-800">Owner Details</h2>
          </div>
          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Avatar */}
          <div className="flex items-center gap-4 mb-6">
            {selectedOwner.image?.url ? (
              <img
                src={selectedOwner.image.url}
                alt={selectedOwner.name}
                className="h-16 w-16 rounded-full object-cover border-2 border-primary"
              />
            ) : (
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold">
                {selectedOwner.name?.charAt(0) || 'O'}
              </div>
            )}
            <div>
              <h3 className="text-lg font-semibold text-gray-800">{selectedOwner.name}</h3>
              <p className="text-sm text-gray-500">Car Owner</p>
            </div>
          </div>

          {/* Info Cards */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Mail size={18} className="text-primary" />
              <div>
                <p className="text-xs text-gray-500">Email Address</p>
                <p className="text-sm font-medium text-gray-700">{selectedOwner.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Phone size={18} className="text-primary" />
              <div>
                <p className="text-xs text-gray-500">Phone Number</p>
                <p className="text-sm font-medium text-gray-700">
                  {selectedOwner.phone || 'Not provided'}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="cursor-pointer w-full mt-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dull transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default OwnerDetailsModal;