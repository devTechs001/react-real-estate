import Card from '../ui/Card';

const PropertyDetails = ({ property }) => {
  return (
    <Card>
      <h2 className="text-2xl font-bold mb-4">PropertyDetails</h2>
      <p className="text-gray-600">Property information will be displayed here.</p>
    </Card>
  );
};

export default PropertyDetails;
