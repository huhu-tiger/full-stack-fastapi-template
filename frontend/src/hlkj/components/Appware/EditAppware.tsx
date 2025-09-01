import {
  Button,
  ButtonGroup,
  DialogActionTrigger,
  Input,
  Text,
  VStack,
  HStack,
} from "@chakra-ui/react"
import { NumberInputRoot, NumberInputField } from "../../../components/ui/number-input"
import { Switch } from "../../../components/ui/switch"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { type SubmitHandler, useForm } from "react-hook-form"
import { FaExchangeAlt } from "react-icons/fa"

import type { ApiError } from "../../../client/core/ApiError"
import useCustomToast from "../../../hooks/useCustomToast"
import { handleError } from "../../../utils"
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog"
import { Field } from "../../../components/ui/field"
import type { AppWarePublic, AppWareUpdate } from "../../types/appware"
import { AppWaresService } from "../../services/appwares"

interface EditAppWareProps {
  appware: AppWarePublic
}

const EditAppWare = ({ appware }: EditAppWareProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const queryClient = useQueryClient()
  const { showSuccessToast } = useCustomToast()
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<AppWareUpdate>({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      name: appware.name,
      remark: appware.remark ?? "",
      sort_order: appware.sort_order,
      status: appware.status,
      is_active: appware.is_active,
      view_count: appware.view_count,
    },
  })

  const mutation = useMutation({
    mutationFn: (data: AppWareUpdate) =>
      AppWaresService.updateAppWare({ 
        appware_id: appware.id, 
        requestBody: data 
      }),
    onSuccess: () => {
      showSuccessToast("应用仓库更新成功！")
      reset()
      setIsOpen(false)
    },
    onError: (err: ApiError) => {
      handleError(err)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["appwares"] })
    },
  })

  const onSubmit: SubmitHandler<AppWareUpdate> = async (data) => {
    mutation.mutate(data)
  }

  return (
    <DialogRoot
      size={{ base: "xs", md: "md" }}
      placement="center"
      open={isOpen}
      onOpenChange={({ open }) => setIsOpen(open)}
    >
      <DialogTrigger asChild>
        <Button variant="ghost">
          <FaExchangeAlt fontSize="16px" />
          编辑应用仓库
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>编辑应用仓库</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <Text mb={4}>更新下面的应用仓库信息。</Text>
            <VStack gap={4}>
              <Field
                required
                invalid={!!errors.name}
                errorText={errors.name?.message}
                label="名称"
              >
                <Input
                  id="name"
                  {...register("name", {
                    required: "名称是必填的。",
                  })}
                  placeholder="请输入应用仓库名称"
                  type="text"
                />
              </Field>

              <Field
                invalid={!!errors.remark}
                errorText={errors.remark?.message}
                label="备注"
              >
                <Input
                  id="remark"
                  {...register("remark")}
                  placeholder="请输入备注信息"
                  type="text"
                />
              </Field>

              <HStack width="full" gap={4}>
                <Field
                  invalid={!!errors.sort_order}
                  errorText={errors.sort_order?.message}
                  label="排序"
                  width="50%"
                >
                  <NumberInputRoot
                    min={0}
                    value={watch("sort_order")?.toString() || ""}
                    onValueChange={(details) => setValue("sort_order", details.valueAsNumber)}
                  >
                    <NumberInputField placeholder="排序号" />
                  </NumberInputRoot>
                </Field>

                <Field
                  invalid={!!errors.status}
                  errorText={errors.status?.message}
                  label="状态"
                  width="50%"
                >
                  <NumberInputRoot
                    min={0}
                    max={1}
                    value={watch("status")?.toString() || ""}
                    onValueChange={(details) => setValue("status", details.valueAsNumber)}
                  >
                    <NumberInputField placeholder="1:启用 0:禁用" />
                  </NumberInputRoot>
                </Field>
              </HStack>

              <Field
                invalid={!!errors.is_active}
                errorText={errors.is_active?.message}
                label="是否激活"
              >
                <Switch
                  {...register("is_active")}
                  checked={watch("is_active") ?? false}
                  onCheckedChange={(details) => setValue("is_active", details.checked)}
                />
              </Field>

              <Field
                invalid={!!errors.view_count}
                errorText={errors.view_count?.message}
                label="浏览量"
              >
                <NumberInputRoot
                  min={0}
                  value={watch("view_count")?.toString() || ""}
                  onValueChange={(details) => setValue("view_count", details.valueAsNumber)}
                >
                  <NumberInputField placeholder="浏览量" />
                </NumberInputRoot>
              </Field>
            </VStack>
          </DialogBody>

          <DialogFooter gap={2}>
            <ButtonGroup>
              <DialogActionTrigger asChild>
                <Button
                  variant="subtle"
                  colorPalette="gray"
                  disabled={isSubmitting}
                >
                  取消
                </Button>
              </DialogActionTrigger>
              <Button variant="solid" type="submit" loading={isSubmitting}>
                保存
              </Button>
            </ButtonGroup>
          </DialogFooter>
        </form>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  )
}

export default EditAppWare
