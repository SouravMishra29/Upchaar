function ProfileSection() {
  return (
    <div className="h-full flex flex-col">

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        My Profile
      </h2>

      <div className="p-6 rounded-xl border
        border-gray-200 dark:border-gray-700
        bg-white dark:bg-gray-900">

        <p className="text-gray-700 dark:text-gray-300">
          Profile details (name, email, settings) will appear here.
        </p>

      </div>

    </div>
  );
}

export default ProfileSection;