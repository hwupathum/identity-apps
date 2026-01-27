import { FunctionComponent } from "react";
import { SVGProps } from "react";
import { ReactComponent as DocumentIcon } from "../../themes/default/assets/images/icons/document-icon.svg";
import { ReactComponent as GearsIcon } from "../../themes/default/assets/images/icons/gears-icon.svg";


export const getConsentWizardStepIcons = (): {
    general: FunctionComponent<SVGProps<SVGSVGElement>>;
    advanced: FunctionComponent<SVGProps<SVGSVGElement>>;
} => {

    return {
        general: DocumentIcon,
        advanced: GearsIcon
    };
};
