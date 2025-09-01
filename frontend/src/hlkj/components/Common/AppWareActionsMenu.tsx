import { IconButton } from "@chakra-ui/react"
import { BsThreeDotsVertical } from "react-icons/bs"
import { MenuContent, MenuRoot, MenuTrigger } from "../../../components/ui/menu"

import type { AppWarePublic } from "../../types/appware"
import DeleteAppWare from "../Appware/DeleteAppare"
import EditAppWare from "../Appware/EditAppware"

interface AppWareActionsMenuProps {
  appware: AppWarePublic
}

export const AppWareActionsMenu = ({ appware }: AppWareActionsMenuProps) => {
  return (
    <MenuRoot>
      <MenuTrigger asChild>
        <IconButton variant="ghost" color="inherit">
          <BsThreeDotsVertical />
        </IconButton>
      </MenuTrigger>
      <MenuContent>
        <EditAppWare appware={appware} />
        <DeleteAppWare id={appware.id} />
      </MenuContent>
    </MenuRoot>
  )
}