import Button from "@/components/Button";
import Card from "@/components/Card";
import InputText from "@/components/InputText";
import Text from "@/components/Text";

export default function page() {
  return (
    <div>
      <Text>Job Description Page</Text>
      <Card>
        <InputText />
      </Card>
      <div className="flex gap-10 items-center justify-center">
      <Button color="primary">Enviar 1</Button>
      <Button color="primary">Enviar 2</Button>
      </div>
    </div>
  )
}
