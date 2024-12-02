import { List } from "@raycast/api";
import DropdownType from "../models/DropdownType";

export default function ListViewDropdown(props: {
  dropdownChoiceTypes: DropdownType[];
  onDropdownChange: (newVal: string) => void;
  tooltip: string;
  defaultValue?: string;
  title: string;
}) {
  return (
    <List.Dropdown
      tooltip={props.tooltip}
      onChange={props.onDropdownChange}
      defaultValue={props.defaultValue}
    >
      <List.Dropdown.Section title={props.title}>
        {props.dropdownChoiceTypes.map((choiceType) => (
          <List.Dropdown.Item
            key={choiceType.id}
            value={choiceType.id}
            title={choiceType.name}
          />
        ))}
      </List.Dropdown.Section>
    </List.Dropdown>
  );
}