<script lang="ts">
    import { Checkbox } from "@imput/helium-prism";
    import { s } from "../lib/strings";
    import type { BrowserProfile } from "../lib/cr";
    import {
        selectedProfiles,
        previouslyImportedProfiles,
    } from "../lib/onboarding-flow";

    type Props = {
        profile: BrowserProfile;
    };

    const { profile }: Props = $props();

    const selected = $derived($selectedProfiles.has(profile.index));
    const disabled = $derived($previouslyImportedProfiles.has(profile.index));

    const toggle = () => {
        if (!selected) {
            $selectedProfiles.add(profile.index);
        } else {
            $selectedProfiles.delete(profile.index);
        }
    };

    const dataList = () => {
        const options = [];

        if (profile.favorites) options.push(s.dataImport.bookmarks);
        if (profile.history) options.push(s.dataImport.history);
        if (profile.extensions) options.push(s.dataImport.extensions);

        return options.join(", ");
    };
</script>

<Checkbox
    class={["profile-option", { selected }]}
    checked={selected || disabled}
    {disabled}
    onchange={toggle}
>
    <div class="text">
        {#if profile.profileName}
            <h4>{profile.profileName}</h4>
        {/if}
        <p>{dataList()}</p>
    </div>
</Checkbox>

<style>
    :global(label.checkbox.profile-option) {
        width: 100%;
        gap: 16px;
        padding: 12px 18px;
        border-radius: 14px;
        background-color: var(--helium-elevated-7);
    }

    :global(label.checkbox.profile-option:first-child:not(:only-child)) {
        border-bottom-left-radius: 6px;
        border-bottom-right-radius: 6px;
    }

    :global(label.checkbox.profile-option:last-child:not(:only-child)) {
        border-top-left-radius: 6px;
        border-top-right-radius: 6px;
    }

    :global(label.checkbox.profile-option:not(:only-child, :last-child, :first-child)) {
        border-radius: 6px;
    }

    :global(label.checkbox.profile-option.selected) {
        box-shadow: 0 0 0 1px var(--primary) inset, 0 0 0 1px var(--primary);
    }

    .text {
        display: flex;
        flex-direction: column;
        gap: 2px;
        text-align: left;
    }

    h4 {
        color: var(--primary);
        font-size: 17px;
    }
</style>
