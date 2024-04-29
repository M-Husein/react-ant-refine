import React from "react";
import {
  ForgotPasswordPageProps,
  ForgotPasswordFormTypes,
  useRouterType,
  useLink,
} from "@refinedev/core";
import {
  Row,
  Col,
  Layout,
  Card,
  Typography,
  Form,
  Input,
  Button,
  LayoutProps,
  CardProps,
  FormProps,
  theme,
} from "antd";
import { useTranslate, useRouterContext, useForgotPassword } from "@refinedev/core";

type ResetPassworProps = ForgotPasswordPageProps<
  LayoutProps,
  CardProps,
  FormProps
>;

/**
 * **refine** has forgot password page form which is served on `/forgot-password` route when the `authProvider` configuration is provided.
 *
 * @see {@link https://refine.dev/docs/ui-frameworks/antd/components/antd-auth-page/#forgot-password} for more details.
 */
const ForgotPasswordPage: React.FC<ResetPassworProps> = ({
  loginLink,
  wrapperProps,
  contentProps,
  renderContent,
  formProps,
  title,
}) => {
  const { token } = theme.useToken();
  const [form] = Form.useForm<ForgotPasswordFormTypes>();
  const translate = useTranslate();
  const routerType = useRouterType();
  const Link = useLink();
  const { Link: LegacyLink } = useRouterContext();

  const ActiveLink = routerType === "legacy" ? LegacyLink : Link;

  const { mutate: forgotPassword, isLoading } = useForgotPassword<ForgotPasswordFormTypes>();

  const PageTitle = title === false ? null : <h1 className="text-center">{import.meta.env.VITE_APP_NAME}</h1>;

  const CardTitle = (
    <Typography.Title
      level={4}
      style={{
        color: token.colorPrimaryTextHover,
        textAlign: 'center',
        marginBottom: 0,
        // fontSize: 24,
        // lineHeight: '32px',
        // fontWeight: 700,
        overflowWrap: 'break-word',
        hyphens: 'manual',
        textOverflow: 'unset',
        whiteSpace: 'pre-wrap',
      }}
    >
      {translate("pages.forgotPassword.title", "Forgot your password?")}
    </Typography.Title>
  );

  const CardContent = (
    <Card
      title={CardTitle}
      style={{
        maxWidth: 400,
        margin: 'auto',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.02), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 1px 2px rgba(0, 0, 0, 0.03)',
        backgroundColor: token.colorBgElevated,
      }}
      styles={{
        header: {
          borderBottom: 0,
          padding: 0,
        },
      }}
      {...(contentProps ?? {})}
    >
      <Form<ForgotPasswordFormTypes>
        layout="vertical"
        form={form}
        onFinish={(values) => forgotPassword(values)}
        requiredMark={false}
        {...formProps}
      >
        <Form.Item
          name="email"
          label={translate("pages.forgotPassword.fields.email", "Email")}
          rules={[
            { required: true },
            {
              type: "email",
              message: translate(
                "pages.forgotPassword.errors.validEmail",
                "Invalid email address",
              ),
            },
          ]}
        >
          <Input
            type="email"
            size="large"
            placeholder={translate(
              "pages.forgotPassword.fields.email",
              "Email",
            )}
          />
        </Form.Item>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          {loginLink ?? (
            <Typography.Text
              style={{
                marginLeft: 'auto',
              }}
            >
              {translate(
                "pages.register.buttons.haveAccount",
                "Have an account? ",
              )}
              {" "}
              <ActiveLink
                to="/login"
                style={{
                  fontWeight: 700,
                  color: token.colorPrimaryTextHover,
                }}
              >
                {translate("pages.login.signin", "Sign in")}
              </ActiveLink>
            </Typography.Text>
          )}
        </div>

        <Form.Item
          style={{
            marginTop: 24,
            marginBottom: 0,
          }}
        >
          <Button
            type="primary"
            size="large"
            htmlType="submit"
            loading={isLoading}
            block
          >
            {translate(
              "pages.forgotPassword.buttons.submit",
              "Send reset instructions",
            )}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );

  return (
    <Layout {...(wrapperProps ?? {})}>
      <Row
        justify="center"
        align="middle"
        style={{
          padding: '16px 0',
          minHeight: '100dvh',
        }}
      >
        <Col xs={22}>
          {renderContent ? (
            renderContent(CardContent, PageTitle)
          ) : (
            <>
              {PageTitle}
              {CardContent}
            </>
          )}
        </Col>
      </Row>
    </Layout>
  );
};

export default ForgotPasswordPage;
