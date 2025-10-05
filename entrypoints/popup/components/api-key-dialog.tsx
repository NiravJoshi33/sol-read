import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowUpRight } from "lucide-react";

interface ApiKeyDialogProps {
  apiKey: string;
  onChange: (apiKey: string) => void;
  onSave: () => void;
}

const ApiKeyDialog = (props: ApiKeyDialogProps) => {
  const { apiKey, onChange, onSave } = props;
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button variant="outline" className="bg-green-500 hover:bg-green-600">
            Add API Key
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add API Key</DialogTitle>
            <DialogDescription className="text-sm text-gray-500 font-medium gap-2 flex flex-row items-center">
              Get your API key from
              <span className="flex flex-row items-center gap-0.5">
                <a
                  className="text-orange-400 flex flex-row items-center gap-0.5"
                  href="https://www.helius.dev/"
                  target="_blank"
                >
                  <ArrowUpRight color="orange" size={16} />
                  Helius
                </a>
              </span>
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name-1">API Key</Label>
              <Input
                id="api-key"
                name="api-key"
                defaultValue={apiKey}
                onChange={(e) => onChange(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>

            <DialogClose asChild>
              <Button
                type="submit"
                className="bg-green-500 hover:bg-green-600"
                onClick={onSave}
              >
                Save
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default ApiKeyDialog;
