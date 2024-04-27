import React from "react";
import {
  LoginPageProps,
  LoginFormTypes,
  useLink,
  useRouterType,
  useActiveAuthProvider,
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
  Checkbox,
  CardProps,
  LayoutProps,
  Divider,
  FormProps,
  theme,
} from "antd";
import { useLogin, useTranslate, useRouterContext } from "@refinedev/core";

// import {
//   bodyStyles,
//   containerStyles,
//   headStyles,
//   layoutStyles,
//   titleStyles,
// } from "../styles";
import { ThemedTitleV2 } from "@refinedev/antd"; // @components

type LoginProps = LoginPageProps<LayoutProps, CardProps, FormProps>;
/**
 * **refine** has a default login page form which is served on `/login` route when the `authProvider` configuration is provided.
 *
 * @see {@link https://refine.dev/docs/ui-frameworks/antd/components/antd-auth-page/#login} for more details.
 */
const LoginPage: React.FC<LoginProps> = ({
  providers,
  registerLink,
  forgotPasswordLink,
  rememberMe,
  contentProps,
  wrapperProps,
  renderContent,
  formProps,
  title,
  hideForm,
}) => {
  const { token } = theme.useToken();
  const [form] = Form.useForm<LoginFormTypes>();
  const translate = useTranslate();
  const routerType = useRouterType();
  const Link = useLink();
  const { Link: LegacyLink } = useRouterContext();

  const ActiveLink = routerType === "legacy" ? LegacyLink : Link;

  const authProvider = useActiveAuthProvider();
  const { mutate: login, isLoading } = useLogin<LoginFormTypes>({
    v3LegacyAuthProviderCompatible: Boolean(authProvider?.isLegacy),
  });

  const PageTitle =
    title === false ? null : (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: 32,
          fontSize: 20,
        }}
      >
        {title ?? <ThemedTitleV2 collapsed={false} />}
      </div>
    );

  const CardTitle = (
    <Typography.Title
      level={3}
      style={{
        color: token.colorPrimaryTextHover,
        // ...titleStyles,

        textAlign: 'center',
        marginBottom: 0,
        fontSize: 24,
        lineHeight: '32px',
        fontWeight: 700,
        overflowWrap: 'break-word',
        hyphens: 'manual',
        textOverflow: 'unset',
        whiteSpace: 'pre-wrap',
      }}
    >
      {translate("pages.login.title", "Sign in to your account")}
    </Typography.Title>
  );

  const renderProviders = () => {
    if (providers && providers.length > 0) {
      return (
        <>
          {providers.map((provider) => {
            return (
              <Button
                key={provider.name}
                type="default"
                block
                icon={provider.icon}
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                  marginBottom: 8,
                }}
                onClick={() =>
                  login({
                    providerName: provider.name,
                  })
                }
              >
                {provider.label}
              </Button>
            );
          })}

          {!hideForm && (
            <Divider>
              <Typography.Text
                style={{
                  color: token.colorTextLabel,
                }}
              >
                {translate("pages.login.divider", "or")}
              </Typography.Text>
            </Divider>
          )}
        </>
      );
    }
    return null;
  };

  const CardContent = (
    <Card
      title={CardTitle}
      style={{
        // ...containerStyles,
        maxWidth: 400,
        margin: 'auto',
        padding: 32,
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.02), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 1px 2px rgba(0, 0, 0, 0.03)',
        backgroundColor: token.colorBgElevated,
      }}
      styles={{
        header: {
          borderBottom: 0,
          padding: 0,
        },
        body: { padding: 0, marginTop: 32 },
      }}
      {...(contentProps ?? {})}
    >
      {renderProviders()}

      {!hideForm && (
        <Form<LoginFormTypes>
          layout="vertical"
          form={form}
          onFinish={(values) => login(values)}
          requiredMark={false}
          initialValues={{
            email: "demo@refine.dev", 
            password: "demodemo",
            remember: false,
          }}
          {...formProps}
        >
          <Form.Item
            name="email"
            label={translate("pages.login.fields.email", "Email")}
            rules={[
              { required: true },
              {
                type: "email",
                message: translate(
                  "pages.login.errors.validEmail",
                  "Invalid email address",
                ),
              },
            ]}
          >
            <Input
              size="large"
              placeholder={translate("pages.login.fields.email", "Email")}
            />
          </Form.Item>
          <Form.Item
            name="password"
            label={translate("pages.login.fields.password", "Password")}
            rules={[{ required: true }]}
          >
            <Input.Password
              size="large"
              autoComplete="current-password"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
            />
          </Form.Item>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: 24,
            }}
          >
            {rememberMe ?? (
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox
                  style={{
                    fontSize: 12,
                  }}
                >
                  {translate("pages.login.buttons.rememberMe", "Remember me")}
                </Checkbox>
              </Form.Item>
            )}
            {forgotPasswordLink ?? (
              <ActiveLink
                to="/forgot-password"
                style={{
                  color: token.colorPrimaryTextHover,
                  fontSize: 12,
                  marginLeft: 'auto',
                }}
              >
                {translate(
                  "pages.login.buttons.forgotPassword",
                  "Forgot password?",
                )}
              </ActiveLink>
            )}
          </div>

          {!hideForm && (
            <Form.Item>
              <Button
                type="primary"
                size="large"
                htmlType="submit"
                loading={isLoading}
                block
              >
                {translate("pages.login.signin", "Sign in")}
              </Button>
            </Form.Item>
          )}
        </Form>
      )}

      {registerLink ?? (
        <div
          style={{
            marginTop: hideForm ? 16 : 8,
          }}
        >
          <Typography.Text style={{ fontSize: 12 }}>
            {translate(
              "pages.login.buttons.noAccount",
              "Don't have an account?",
            )}
            {" "}
            <ActiveLink
              to="/register"
              style={{
                fontWeight: 700,
                color: token.colorPrimaryTextHover,
              }}
            >
              {translate("pages.login.signup", "Sign up")}
            </ActiveLink>
          </Typography.Text>
        </div>
      )}
    </Card>
  );

  return (
    <Layout 
      // style={layoutStyles} 
      {...(wrapperProps ?? {})}
    >
      <Row
        justify="center"
        align={hideForm ? "top" : "middle"}
        style={{
          padding: '16px 0',
          minHeight: '100dvh',
          paddingTop: hideForm ? '15dvh' : 16,
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

export default LoginPage;
