import Text from "@/components/Text";
import Button from "@/components/Button";
import Card from "@/components/Card";
import InputText from "@/components/InputText";

export default function page() {
  return (
    <div className="flex flex-col gap-10">
      <div>Components Page</div>
      <div className="flex flex-col">
        <Text as="h1" size="lg" color="primary">Text H1 lg</Text>
        <Text as="h1" size="md" color="primary">Text H1 md</Text>
        <Text as="h1" size="sm" color="primary">Text H1 sm</Text>
      </div>
      <div className="flex flex-col gap-5">
        <Button variant="light" size="sm">Button</Button>
        <Button variant="light" size="sm" disabled>Button Disabled</Button>
      </div>
      <div>
        <Card size="sm">
          <Text>Card Text</Text>
        </Card>
      </div>
      <div>
        <InputText placeholder="Placeholder" />
      </div>
    </div>
  )
}
