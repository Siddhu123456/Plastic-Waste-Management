import React from 'react'

const TermsAndConditions = () => {
  return (
    <div className="text-sm p-4 space-y-4 text-tc dark:text-ow">
      <h2 className="text-lg font-semibold">Terms and Conditions</h2>

      <p>
        By creating an account, you agree to the following terms:
      </p>

      <div>
        <h3 className="font-semibold">1. Account & Registration</h3>
        <ul className="list-disc pl-5">
          <li>You must provide accurate information when registering for an account.</li>
          <li>Your account is personal and cannot be shared or transferred to others.</li>
        </ul>
      </div>

      <div>
        <h3 className="font-semibold">2. Plastic Waste Pickup</h3>
        <ul className="list-disc pl-5">
          <li>Requests for plastic waste pickup must be made through your account.</li>
          <li>You agree to submit only clean and sorted plastic waste for pickup.</li>
          <li>Plastic waste will be evaluated based on quantity and quality for Green Coin rewards.</li>
        </ul>
      </div>

      <div>
        <h3 className="font-semibold">3. Green Coin System</h3>
        <ul className="list-disc pl-5">
          <li>Green Coins are earned based on the amount and quality of plastic waste submitted.</li>
          <li>Green Coins can only be redeemed for products on our platform, not for cash.</li>
          <li>Green Coin balances and rewards may be adjusted at our discretion.</li>
        </ul>
      </div>

      <div>
        <h3 className="font-semibold">4. Privacy & Data Usage</h3>
        <ul className="list-disc pl-5">
          <li>Your personal data will be used only to facilitate service requests (e.g., pickups, rewards).</li>
          <li>We do not sell or share your personal data with third parties for marketing purposes.</li>
        </ul>
      </div>

      <div>
        <h3 className="font-semibold">5. Termination & Account Management</h3>
        <ul className="list-disc pl-5">
          <li>You may request to delete your account at any time.</li>
          <li>We reserve the right to suspend or terminate accounts that violate these Terms.</li>
        </ul>
      </div>

      <p>
        These Terms and Conditions may change over time. Continued use of the platform implies acceptance of any changes.
      </p>

    </div>
  )
}

export default TermsAndConditions
