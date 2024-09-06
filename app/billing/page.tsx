import SubscribeComponent from '../components/Billing/Card'
import Nav from '../components/Main/Nav'

export default function Page() {
  return (
    <>
      <Nav/>

      <div className="text-center mt-10">
        <h2 className="text-3xl font-bold text-gray-200 mb-4">Welcome to Our Pricing Plans</h2>
        <p className="text-xl text-gray-400">Choose the plan that best fits your needs</p>
        
      </div>
    
      <SubscribeComponent/>
    </>)
}