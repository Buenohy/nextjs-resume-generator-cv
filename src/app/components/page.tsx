import Text from "@/components/Text";
import Button from "@/components/Button";

export default function page() {
  return (
    <div className="flex flex-col">
      <div>Components Page</div>
      <div className="flex flex-col">
        <Text as="h1" size="lg" color="primary">Text H1 lg</Text>
        <Text as="h1" size="md" color="primary">Text H1 md</Text>
        <Text as="h1" size="sm" color="primary">Text H1 sm</Text>
      </div>
      <div className="flex flex-col">
        <Button color="secondary" size="lg">Button Primary md</Button>
        <Button color="primary" size="md">Button Primary md</Button>
        <Button color="primary" size="sm">Button Primary sm</Button>
      </div>
    </div>
  )
}
