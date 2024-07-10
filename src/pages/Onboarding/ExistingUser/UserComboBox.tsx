"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button, ButtonProps } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { UserListItem } from "@/hooks/useUserList";
import Avatar from "@/components/common/avatar";

type UserComboBoxProps = {
  userListItems: UserListItem[];
  valueState?: [string, React.Dispatch<React.SetStateAction<string>>];
} & ButtonProps;

const UserComboBox = ({
  userListItems,
  valueState,
  ...props
}: UserComboBoxProps) => {
  const [open, setOpen] = React.useState(false);
  const tempValueState = React.useState("");
  const [value, setValue] = valueState ? valueState : tempValueState;

  const userItemByValue = userListItems.find((user) => user.username === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          {...props}
          variant={props.variant ? props.variant : "outline"}
          role="combobox"
          aria-expanded={open}
          className={`w-full justify-between ${props.className}`}
        >
          {value ? (
            <>
              {userItemByValue ? (
                <div className="flex items-center gap-2">
                  <Avatar address={userItemByValue.avatarHex} size={20} />{" "}
                  <span>{userItemByValue.username}</span>
                </div>
              ) : (
                <></>
              )}
            </>
          ) : (
            "Select user to log in..."
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search user..." />
          <CommandList>
            <CommandEmpty>No user found.</CommandEmpty>
            <CommandGroup>
              {userListItems.map((user) => (
                <CommandItem
                  key={user.username}
                  value={user.username}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  {value === user.username ? (
                    <Check className={cn("mr-2 h-4 w-4")} />
                  ) : (
                    <div className="mr-2 h-4 w-4">
                      <Avatar address={user.avatarHex} size={20} />
                    </div>
                  )}
                  {user.username}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default UserComboBox;
