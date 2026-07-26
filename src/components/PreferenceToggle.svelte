<script lang="ts">
    import { Toggle } from "@imput/helium-prism";
    import { preferences, setPref, type Preferences } from "../lib/browser";

    type BooleanPreference = {
        [Key in keyof Preferences]: Preferences[Key] extends boolean ? Key : never
    }[keyof Preferences];

    type Props = {
        title: string;
        desc: string;
        prefName: BooleanPreference;
        disabled?: boolean;
    };

    const { title, desc, prefName, disabled }: Props = $props();
    const checked = $derived($preferences[prefName]);
</script>

<Toggle
    name={title}
    {desc}
    {checked}
    {disabled}
    onchange={(enabled) => setPref(prefName, enabled)}
/>
